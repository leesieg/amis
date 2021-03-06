import React from 'react';
import {themeable, ClassNamesFn} from '../theme';
import {autobind} from '../utils/helper';
import Modal from './Modal';
import {Icon} from './icons';

export interface ImageGalleryProps {
  classnames: ClassNamesFn;
  classPrefix: string;
  children: React.ReactNode;
}

export interface ImageGalleryState {
  isOpened: boolean;
  index: number;
  items: Array<{
    src: string;
    originalSrc: string;
    title?: string;
    caption?: string;
  }>;
}

export class ImageGallery extends React.Component<
  ImageGalleryProps,
  ImageGalleryState
> {
  state: ImageGalleryState = {
    isOpened: false,
    index: -1,
    items: []
  };

  @autobind
  handleImageEnlarge(info: {
    src: string;
    originalSrc: string;
    list?: Array<{
      src: string;
      originalSrc: string;
      title?: string;
      caption?: string;
    }>;
    title?: string;
    caption?: string;
    index?: number;
  }) {
    this.setState({
      isOpened: true,
      items: info.list ? info.list : [info],
      index: info.index || 0
    });
  }

  @autobind
  close() {
    this.setState({
      isOpened: false
    });
  }

  @autobind
  prev() {
    const index = this.state.index;
    this.setState({
      index: index - 1
    });
  }

  @autobind
  next() {
    const index = this.state.index;
    this.setState({
      index: index + 1
    });
  }

  @autobind
  handleItemClick(e: React.MouseEvent<HTMLDivElement>) {
    const index = parseInt(e.currentTarget.getAttribute('data-index')!, 10);
    this.setState({
      index
    });
  }

  render() {
    const {children, classnames: cx} = this.props;
    const {index, items} = this.state;

    return (
      <>
        {React.cloneElement(children as any, {
          onImageEnlarge: this.handleImageEnlarge
        })}

        <Modal
          closeOnEsc
          size="full"
          onHide={this.close}
          show={this.state.isOpened}
          contentClassName={cx('ImageGallery')}
        >
          <a
            data-tooltip="关闭"
            data-position="left"
            className={cx('ImageGallery-close')}
            onClick={this.close}
          >
            <Icon icon="close" />
          </a>
          {~index && items[index] ? (
            <>
              <div className={cx('ImageGallery-title')}>
                {items[index].title}
              </div>
              <div className={cx('ImageGallery-main')}>
                <img src={items[index].originalSrc} />

                {items.length > 1 ? (
                  <>
                    <a
                      className={cx(
                        'ImageGallery-prevBtn',
                        index <= 0 ? 'is-disabled' : ''
                      )}
                      onClick={this.prev}
                    >
                      <Icon icon="prev" />
                    </a>
                    <a
                      className={cx(
                        'ImageGallery-nextBtn',
                        index >= items.length - 1 ? 'is-disabled' : ''
                      )}
                      onClick={this.next}
                    >
                      <Icon icon="next" />
                    </a>
                  </>
                ) : null}
              </div>
            </>
          ) : null}
          {items.length > 1 ? (
            <div className={cx('ImageGallery-footer')}>
              <a className={cx('ImageGallery-prevList is-disabled')}>
                <Icon icon="prev" />
              </a>
              <div className={cx('ImageGallery-itemsWrap')}>
                <div className={cx('ImageGallery-items')}>
                  {items.map((item, i) => (
                    <div
                      key={i}
                      data-index={i}
                      onClick={this.handleItemClick}
                      className={cx(
                        'ImageGallery-item',
                        i === index ? 'is-active' : ''
                      )}
                    >
                      <img src={item.src} />
                    </div>
                  ))}
                </div>
              </div>
              <a className={cx('ImageGallery-nextList is-disabled')}>
                <Icon icon="next" />
              </a>
            </div>
          ) : null}
        </Modal>
      </>
    );
  }
}

export default themeable(ImageGallery);
